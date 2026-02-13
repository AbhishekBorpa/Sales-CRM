const Lead = require('../models/Lead');

// Simple fuzzy matching for duplicate detection
function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    if (s1 === s2) return 100;

    // Check if one contains the other
    if (s1.includes(s2) || s2.includes(s1)) return 80;

    // Basic Levenshtein-like scoring
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 100;

    const editDistance = [...longer].filter((char, i) => char !== shorter[i]).length;
    return Math.round((1 - editDistance / longer.length) * 100);
}

exports.findDuplicates = async (req, res) => {
    try {
        const { entityType = 'Lead', threshold = 70 } = req.query;

        let Model;
        if (entityType === 'Lead') Model = Lead;
        else if (entityType === 'Opportunity') Model = require('../models/Opportunity');
        else if (entityType === 'Account') Model = require('../models/Account');
        else return res.status(400).json({ message: 'Invalid entity type' });

        const records = await Model.find({ isDeleted: { $ne: true } });
        const duplicates = [];

        // Compare each record with others
        for (let i = 0; i < records.length; i++) {
            for (let j = i + 1; j < records.length; j++) {
                const record1 = records[i];
                const record2 = records[j];

                const nameScore = calculateSimilarity(
                    record1.name || record1.title,
                    record2.name || record2.title
                );
                const emailScore = record1.email && record2.email
                    ? calculateSimilarity(record1.email, record2.email)
                    : 0;
                const companyScore = record1.company && record2.company
                    ? calculateSimilarity(record1.company, record2.company)
                    : 0;

                // Weighted average
                const score = Math.round((nameScore * 0.4 + emailScore * 0.4 + companyScore * 0.2));

                if (score >= threshold) {
                    duplicates.push({
                        records: [record1, record2],
                        score,
                        matchedFields: {
                            name: nameScore >= threshold,
                            email: emailScore >= threshold,
                            company: companyScore >= threshold
                        }
                    });
                }
            }
        }

        // Sort by score descending
        duplicates.sort((a, b) => b.score - a.score);

        res.json({ duplicates, total: duplicates.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.mergeDuplicates = async (req, res) => {
    try {
        const { primaryId, duplicateIds, entityType = 'Lead', fieldSelections } = req.body;

        let Model;
        if (entityType === 'Lead') Model = Lead;
        else if (entityType === 'Opportunity') Model = require('../models/Opportunity');
        else if (entityType === 'Account') Model = require('../models/Account');
        else return res.status(400).json({ message: 'Invalid entity type' });

        const primary = await Model.findById(primaryId);
        if (!primary) return res.status(404).json({ message: 'Primary record not found' });

        // Merge fields from duplicates based on user selection
        if (fieldSelections) {
            for (const [field, recordId] of Object.entries(fieldSelections)) {
                if (recordId !== primaryId) {
                    const sourceRecord = await Model.findById(recordId);
                    if (sourceRecord && sourceRecord[field]) {
                        primary[field] = sourceRecord[field];
                    }
                }
            }
            await primary.save();
        }

        // Soft delete duplicates
        for (const dupId of duplicateIds) {
            await Model.findByIdAndUpdate(dupId, { isDeleted: true });
        }

        res.json({
            message: 'Records merged successfully',
            primary,
            mergedCount: duplicateIds.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

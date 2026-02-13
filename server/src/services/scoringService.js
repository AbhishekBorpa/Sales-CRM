const calculateLeadScore = (lead) => {
    let score = 0;

    // 1. Title Scoring (Decision Makers get more points)
    const title = (lead.title || '').toLowerCase();
    if (title.includes('vp') || title.includes('vice president')) score += 20;
    else if (title.includes('director')) score += 15;
    else if (title.includes('manager')) score += 10;
    else if (title.includes('ceo') || title.includes('founder') || title.includes('c-level')) score += 25;

    // 2. Company Size / Revenue
    if (lead.annualRevenue > 1000000) score += 20; // >1M
    else if (lead.annualRevenue > 500000) score += 10;
    else if (lead.annualRevenue > 100000) score += 5;

    // 3. Source Quality
    const sourceMap = {
        'Referral': 20,
        'Website': 10,
        'Event': 15,
        'Cold Call': 5,
        'Other': 0
    };
    score += sourceMap[lead.source] || 0;

    // 4. Completeness
    if (lead.email) score += 5;
    if (lead.phone) score += 5;
    if (lead.website) score += 5;

    // Cap at 100
    return Math.min(score, 100);
};

module.exports = { calculateLeadScore };

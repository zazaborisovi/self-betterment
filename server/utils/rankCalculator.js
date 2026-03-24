const calculateRank = (points) =>{
    if (points >= 50000) return "S+";
    if (points >= 20000) return "S";
    if (points >= 10000) return "A";
    if (points >= 5000) return "B";
    if (points >= 2000) return "C";
    if (points >= 1000) return "D";
    return "F";
}
const calculateSkillRank = (points) =>{
    if (points >= 50000) return "S+";
    if (points >= 20000) return "S";
    if (points >= 10000) return "A";
    if (points >= 5000) return "B";
    if (points >= 2000) return "C";
    if (points >= 1000) return "D";
    return "F";
}

module.exports = {calculateRank , calculateSkillRank}
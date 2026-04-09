const calculateRank = (points) =>{
    if (points >= 50000) return "S+";
    if (points >= 20000) return "S";
    if (points >= 10000) return "A";
    if (points >= 5000) return "B";
    if (points >= 2000) return "C";
    if (points >= 1000) return "D";
    return "F";
}
const maxXpCalculator = (rank) =>{
    if(rank == "F") return 1000;
    if(rank == "D") return 2000;
    if(rank == "C") return 5000;
    if(rank == "B") return 10000;
    if(rank == "A") return 20000;
    if(rank == "S") return 50000;
    if(rank == "S+") return 100000;
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

module.exports = {calculateRank , maxXpCalculator , calculateSkillRank}
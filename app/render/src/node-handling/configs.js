export const handleNodeColor = (depType) => {
    if (depType === 'local') return 'lightblue';
    else if (depType === 'root') return '#FFF8DC';
    else return 'darkseagreen';
}

export const handleAnimated = (depType, active=true) => {
    if (active === true) return false
    return true;
}

export const handleEdgeType = (depType) => {
    if (depType === 'local' || depType === "root") return "straight";
    return 'custom';
}

export const handleEdgeStyle = (depType, active=true) => {
    if (active) {
        // if (depType === 'local' || depType === "root") return {'strokeWidth': 2.5, 'stroke': '#7070f5'};
        // return {'strokeWidth': 0.7, 'stroke': '#d37ef2'};
        if (depType === 'local' || depType === "root") return {'strokeWidth': 3.5, 'stroke': 'lightblue'};
        return {'strokeWidth': 0.5, 'stroke': 'darkseagreen'};
    } else {
        return {'strokeWidth': 3, 'stroke': '#E54B4B'};
    }
}
export const handleNodeColor = (depType) => {
    if (depType === 'local') return '#A4DDED';
    else if (depType === 'root') return '#FFF8DC';
    else return '#FA8072';
}

export const handleAnimated = (depType) => {
    if (depType === 'local' || depType === "root") return false
    return true;
}

export const handleEdgeType = (depType) => {
    if (depType === 'local' || depType === "root") return "straight";
    return "custom";
}

export const handleEdgeStyle = (depType) => {
    if (depType === 'local' || depType === "root") return {'strokeWidth': 2.5, 'stroke': 'lightblue'};
    return {'strokeWidth': 0.7, 'stroke': 'salmon'};
}
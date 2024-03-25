export const keyboard = (s) => {
    s = s.toLowerCase();
    const data = [
        ['ctrl', '⌘'],
        ['alt', '⌥'],
        ['shift', '⇧']
    ];
    if (eagle.app.isMac) {
        for (let i of data) {
            s = s.replace(i[0], i[1]);
        }
    } else {
        for (let i of data) {
            s = s.replace(i[1], i[0]);
        }
    }
    return s;
};

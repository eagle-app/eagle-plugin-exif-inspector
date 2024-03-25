// 將文字轉成駝峰式胃給 i18next 使用
export const t = (s, options) =>
    i18next.t(
        s

            ?.trim()
            .split(' ')
            .map((s, i) => (i == 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
            .join(''),
        options
    );

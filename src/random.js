export const randAlpha = function(n)
{
    return rand("abcdefghijklmnopqrstuvwxyz".split(''), n);
}

export const randAlphaCs = function(n)
{
    return rand("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''), n);
}

export const randAlphaNum = function(n)
{
    return rand("0123456789abcdefghijklmnopqrstuvwxyz".split(''), n);
}

export const randAlphaNumCs = function(n)
{
    return rand("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''), n);
}

export const randNum = function(n)
{
    return rand("0123456789".split(''), n);
}

export const rand = function(range, n)
{
    let rand = "";

    for (let i=0; i<n; i++) {
        rand += range[Math.floor(Math.random() * 1000) % range.length];
    }

    return rand;
}

export const uniqid = (function() {
    let uid = 0;

    return function(prefix = '') {
        uid++;
        return `${prefix}${Date.now().toString(36)}_${uid.toString(36)}_${randAlphaNum(5)}`;
    }
})()

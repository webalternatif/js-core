export const uniqid = function()
{
    return randAlpha(10);
};

export const randAlpha = function(n)
{
    return rand("a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(','), n);
};

export const randAlphaCs = function(n)
{
    return rand("a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(','), n);
};

export const randAlphaNum = function(n)
{
    return rand("0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(','), n);
};

export const randAlphaNumCs = function(n)
{
    return rand("0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(','), n);
};

export const randNum = function(n)
{
    return rand("0,1,2,3,4,5,6,7,8,9".split(','), n);
};

export const rand = function(range, n)
{
    let rand = "";

    for (let i=0; i<n; i++) {
        rand += range[Math.floor(Math.random() * 1000) % range.length];
    }

    return rand;
};

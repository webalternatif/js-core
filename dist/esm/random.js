export var uniqid = function uniqid() {
  return randAlpha(10);
};
export var randAlpha = function randAlpha(n) {
  return rand("a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(','), n);
};
export var randAlphaCs = function randAlphaCs(n) {
  return rand("a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(','), n);
};
export var randAlphaNum = function randAlphaNum(n) {
  return rand("0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(','), n);
};
export var randAlphaNumCs = function randAlphaNumCs(n) {
  return rand("0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(','), n);
};
export var randNum = function randNum(n) {
  return rand("0,1,2,3,4,5,6,7,8,9".split(','), n);
};
export var rand = function rand(range, n) {
  var rand = "";
  for (var i = 0; i < n; i++) {
    rand += range[Math.floor(Math.random() * 1000) % range.length];
  }
  return rand;
};
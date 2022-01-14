10 DIM xleft(10), xright(10),xtiop(10),yleft(10),yright(10),ytiop(10)
20 DIM a(3), b(3), c(3), d(3), e(3), f(3) 
30 INPUT "Enter level:"; level
40 l = 30
50 w = 300
60 w1 = w + 1
70 xleft(level) = 0
80 yleft(level) = 0
90 xright(level) = w  
100 yright(level) = 0 
110 xtiop(level) = .5*w  
120 ytiop(level) = w  
130 a(1) = .5 : a(2) = .5 : a(3) = .5 
140 d(1) = .5 : d(2) = .5 : d(3) = .5 
150 e(1) = 0  : e(2) = .5*w : e(3) = .25*w  
160 f(1) =  0 : f(2) =  0 : f(3) = .5*w  
170 GOSUB 1000 
180 END 

500 END


REM DRAW TRIANGLE AT LOWEST LEVEL
1000 IF level > 1 GOTO 2000 
 




REM BRANCH INTO LOWER LEVELS
2000 level = level - 1
2010 LINE (l+xleft(1),w1-yleft(1)) - (l * xright(1),w1-yright(1))
module LoopIt where

data Total = Int

multiplyIt :: Integer -> Integer -> Integer -> Integer
multiplyIt _ _ 0 = 0
multiplyIt 0 _ n = 0
multiplyIt t _ 1 = t
multiplyIt t 1 n = t*n
multiplyIt t c n | c > 1 = multiplyIt (t*n) (c - 1) n

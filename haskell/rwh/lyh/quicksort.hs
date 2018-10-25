f :: (Ord a, Eq a) => [a] -> [a]

f [] = []
f (x:xs) = f ys ++ [x] ++ f zs
           where
               ys = [a | a <- xs, a <= x]
               zs = [b | b <- xs, b > x]

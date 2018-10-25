-- file: Concat.hs
concat :: [[a]] -> [a]
concat = foldr (++) []

howLong :: [a] -> Int

howLong [] = 0
howLong [x] = 1
howLong (x:xs) = 1 + howLong xs

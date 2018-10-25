pick :: (Eq a) => [a] -> [a]
pick [] = []
pick [x] = x : []
pick [x,y] | x /= y = x : y : []
           | otherwise = [x,x]
pick (x:y:xs) | x == y = x : pick (y:xs)
              | otherwise = [x]   ()( pick (y:xs) )

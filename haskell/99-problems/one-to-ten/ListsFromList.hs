groupIt :: (Eq a) => [a] -> [[a]]
groupIt [] = [[]]
groupIt Nothing = Nothing
groupIt [x] = [[x]]
groupIt (x:xs) = (x:ax) : gs
                 where ax  = gather x xs
                       len = length ax
                       ys = drop len xs
                       gs  | len == 0 = []
                           | otherwise = groupIt ys

countIt :: (Eq a) => [a] -> [(Int, a)]
countIt [] = []
countIt [x] = [(1,x)]
countIt (x:xs) = (n,x) : gs
                 where  ax = gather x xs
                        n  = length ax
                        ys = drop n xs
                        n2 = length ys
                        gs  | n2 == 0 = []
                            | otherwise = countIt ys

gather :: (Eq a) => a -> [a] -> [a]
gather _ [] = []
gather x (y:ys) | x == y = y : gather x ys
                | otherwise = []

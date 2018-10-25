pack :: (Eq a) => [a] -> [[a]]
pack [] = [[]]
pack [x] = [[x]]
pack [x,y]    | x == y = [[x,x]]
              | otherwise = [[x],[y]]

pack (x:y:xs) | x == y = (x : group' x (y:xs)) : []
              | otherwise = x : [] : pack (y:xs)

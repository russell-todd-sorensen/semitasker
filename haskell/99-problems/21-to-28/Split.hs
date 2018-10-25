module Split where

split :: [a] -> Int -> ([a],[a])
split (x:xs) n = shuffle ([],x:xs) n

shuffle :: ([a],[a]) -> Int -> ([a],[a])
shuffle (xl, []) _ = (xl, [])
shuffle (xl, (x:xr)) n | len == n = (xl, (x:xr))
                       | len2 == 0 = ((xl++[x], []))
                       | otherwise = shuffle ((xl++[x]), xr) n
                       where
                          len  = length xl
                          len2 = length xr

shuttle :: ([a],[a]) -> Int -> ([a],[a])
shuttle ([], []) _ = ([],[])
shuttle (xl, []) 0 = ([], xl)
shuttle (xl, []) n     | n < 0      = ([], xl)
                       | len >  n   = shuttle (init xl, ([last xl])) n
                       | otherwise  = (xl, [])
                       where len = length xl
                       -- | otherwise = (xl, [])
shuttle (xl, (x:xr)) n | n < 0     = (x:xr, xl)
                       | len ==  n = (xl, (x:xr))
                       | len >   n = shuttle (init xl, ((last xl):x:xr)) n
                       | len2 == 0 = ((xl++[x], []))
                       | otherwise = shuttle ((xl++[x]), xr) n
                       where
                          len  = length xl
                          len2 = length xr

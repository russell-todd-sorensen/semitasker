module Split where

split :: [a] -> Int -> ([a],[a])
split (x:xs) n -- | lenX == 0 = ([], xs)
               | otherwise = shuffle ([],x:xs) n
               -- where
                --``   lenX = (length x) + (length xs)

shuffle :: ([a],[a]) -> Int -> ([a],[a])
shuffle (xl, (x:xr)) n | len == n = (xl, (x:xr))
                       | len2 == 0 = ((xl++[x], []))
                       | otherwise = shuffle ((xl++[x]), xr) n
                       where
                          len  = length xl
                          len2 = length xr

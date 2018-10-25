module Slice where

slice :: [a] -> Int -> Int -> [a]

slice l s e | e > 0 = slice le s 0
            | otherwise = drop (s - 1) l
            where
                le = take e l

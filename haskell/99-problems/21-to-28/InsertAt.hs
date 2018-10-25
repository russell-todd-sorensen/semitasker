module InsertAt where
import Split (shuffle)
insertAt :: a -> [a] -> Int -> [a]
insertAt x xs 1 = x : xs
insertAt x xs n = xl ++ [x] ++ xr
                where (xl,xr) = shuffle ([],xs) (n - 1)

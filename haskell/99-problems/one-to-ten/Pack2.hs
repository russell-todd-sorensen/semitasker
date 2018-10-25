module Pack2 where
import Data.List (group)
pack :: (Eq a) => [a] -> [[a]]
pack = group

module Logical where

not' :: Bool -> Bool -> Bool
not' True = False
not' False = True

and' :: Bool -> Bool -> Bool
and' True True = True
and' _ _       = False

or' :: Bool -> Bool -> Bool
or' False False = False
or' _ _         = True

nor' :: Bool -> Bool -> Bool
nor' False False = True
nor' _ _         = False

nand' :: Bool -> Bool -> Bool
nand' True True = False
nand' _ _       = True

xor' :: Bool -> Bool -> Bool
xor' True False = True
xor' False True = True
xor' _ _        = False

equ' :: Bool -> Bool -> Bool
equ' True   True = True
equ' False False = True
equ' _ _         = False

infixl 3 `equ'`

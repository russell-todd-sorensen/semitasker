-- file: BookStore.hs
data BookInfo = Book Int String [String]
    deriving (Show)

data MagazineInfo = Magazine Int String [String]
    deriving (Show)

myInfo = Book 9870135072455 "Algebra of Programming"
    ["Richard Bird", "Oege De Moor"]

-- we will introduce the CustomerID shortly

data BookReview = BookReview BookInfo CustomerID String

type CustomerID = Int
type ReviewBody = String

data BetterReview = BetterReview BookInfo CustomerID ReviewBody

type BookRecord = (BookInfo, BookReview)

type CardHolder = String
type CardNumber = String
type Address = [String]

data BillingInfo = CreditCard CardNumber CardHolder Address
    | CashOnDelivery
    | Invoice CustomerID
    deriving (Show)

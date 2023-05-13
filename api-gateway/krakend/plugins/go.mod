module digital-twin/krakend

// NOTE: Had to check versions of go.mod in https://github.com/krakendio/krakend-ce/blob/master/go.mod because different versions cause errors
go 1.17

require (
	github.com/stripe/stripe-go/v74 v74.18.0
	github.com/tidwall/buntdb v1.3.0
	golang.org/x/crypto v0.9.0
)

replace (
	github.com/tidwall/buntdb => github.com/tidwall/buntdb v1.3.0
	golang.org/x/crypto => golang.org/x/crypto v0.5.0
)

require (
	github.com/tidwall/btree v1.4.2 // indirect
	github.com/tidwall/gjson v1.14.3 // indirect
	github.com/tidwall/grect v0.1.4 // indirect
	github.com/tidwall/match v1.1.1 // indirect
	github.com/tidwall/pretty v1.2.0 // indirect
	github.com/tidwall/rtred v0.1.2 // indirect
	github.com/tidwall/tinyqueue v0.1.1 // indirect
)

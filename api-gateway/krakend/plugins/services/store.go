// Create a singleton store go-cache
package services

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/tidwall/buntdb"
)

type StoreSingleton struct {
	store *buntdb.DB
}

type StripeStore struct {
	ApiKeyHash string
	Active     bool
	ItemId     string
	CustomerId string
}

var instance *StoreSingleton
var once sync.Once

func GetStoreInstance() *StoreSingleton {
	once.Do(func() {
		// Open the database
		db, err := buntdb.Open("./stores/store.db")
		if err != nil {
			log.Fatal(err)
		}
		instance = &StoreSingleton{
			store: db,
		}
	})
	return instance
}

func (s *StoreSingleton) Get(key string) (*StripeStore, error) {
	var stripeStore StripeStore
	err := s.store.View(func(txn *buntdb.Tx) error {
		val, err := txn.Get(key)
		if err != nil {
			return err
		}
		err = json.Unmarshal([]byte(val), &stripeStore)
		if err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return &stripeStore, nil
}

func (s *StoreSingleton) Set(key string, value StripeStore) error {
	return s.store.Update(func(txn *buntdb.Tx) error {
		// Marshal the struct into string
		json, err := json.Marshal(value)
		if err != nil {
			return err
		}
		_, _, err = txn.Set(key, string(json), nil)
		return err
	})
}

func (s *StoreSingleton) Delete(key string) error {
	return s.store.Update(func(txn *buntdb.Tx) error {
		_, err := txn.Delete(key)
		return err
	})
}

func (s *StoreSingleton) GetAll() []StripeStore {
	var stripeStores []StripeStore
	s.store.View(func(txn *buntdb.Tx) error {
		txn.Ascend("", func(key, value string) bool {
			var stripeStore StripeStore
			json.Unmarshal([]byte(value), &stripeStore)
			stripeStores = append(stripeStores, stripeStore)
			return true
		})
		return nil
	})
	return stripeStores
}

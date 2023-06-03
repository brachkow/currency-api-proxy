# currency-api-proxy

Cloudflare Workers proxy for Open Exchange Rates free API

## Features

- KV Cache (that means you will always have just one request a day)
- Chronjob support — automaticaly create rates history inside KV
- Authorization

## How to use authorization

Find «currency-api-KEYS» KV and add a record with any string you want use as Key, and «true» as Value.

To invalidate this key — just delete it.

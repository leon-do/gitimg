# GitImg

# curl
```bash
curl -X POST http://localhost:3000/gitimg \
  -H "Content-Type: application/json" \
  -d "{\"fileName\":\"test.png\",\"base64Content\":\"$(base64 -i test.png | tr -d '\n')\"}"
```

# response
```js
{"imgUrl":"https://raw.githubusercontent.com/0x130N/gitimg/main/test.png"}
```

# Github Token

## Use a fine-grained personal access token

Go to Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.

Give it a name and expiration.

Select the Repository access:

Choose Only select repositories → pick the repo you want to upload images to.

## Permissions:

Contents → Read & Write ✅ (needed to upload files)

No need for Delete permissions.

Leave everything else as default (or none).

Generate token and copy it.

This token allows you to create new files. Set in `.env`

```
GITHUB_TOKEN=github_jat_11AYPVW
GITHUB_OWNER=joe
GITHUB_REPO=myRepo
```
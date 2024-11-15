include .env

run:
	npm run dev

test:
	npm run test

migration_generate:
	typeorm-ts-node-commonjs migration:generate ./src/migrations/$(name) -d ./src/data-source.ts

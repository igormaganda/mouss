#!/bin/bash
export DATABASE_URL="postgresql://creapulse_user:Creapulse%402026%21Secure@109.123.249.114:5432/creapulse?schema=public"
bunx prisma "$@"

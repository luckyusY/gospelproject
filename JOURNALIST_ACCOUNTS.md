# Journalist accounts

The admin area supports two journalist accounts in addition to the main admin account.

Default local credentials:

```text
journalist1 / urugero_journalist_1_2026
journalist2 / urugero_journalist_2_2026
```

Journalists can:

- create stories
- edit their own stories
- publish or unpublish their own stories
- delete their own stories

Journalists cannot:

- edit stories owned by other writers
- change the story author
- mark stories as featured
- access the main admin dashboard through the sidebar

For production, set these environment variables in Vercel:

```text
JOURNALIST_ONE_USERNAME=journalist1
JOURNALIST_ONE_PASSWORD=use-a-strong-password
JOURNALIST_ONE_NAME=Reporter Name

JOURNALIST_TWO_USERNAME=journalist2
JOURNALIST_TWO_PASSWORD=use-another-strong-password
JOURNALIST_TWO_NAME=Reporter Two
```

You can also use `ADMIN_USERS` for more accounts:

```text
admin:admin-password:admin:Admin Name,journalist3:password:journalist:Reporter Three
```

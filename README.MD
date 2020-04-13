# Instacart Bot

You can run this on your local machine (or a server machine) to get alerted when shoppers have become available.

The simplest way to run this would be with:

```
watch -n 240 "node index.js --username=EMAIL --pw=\"PW\" && notify-send \"Instacart Bot\" \"Looks like something is available\""
```

The script will return exit code 0 when shoppers become available; so you can chain some kind of notification in there. You may want to use something like Pushover
instead of a terminal notify if you're not at your workstation a lot. 

Notes: 

1. If you scrape too often, you might get outsted as a bot. 
2. Developed for COVID-19; it may stop working given enough time. 
3. It will only check the last stored you had selected. You can login through a normal browser and change your store if you want to starting tracking another.
   Or use more than one account. Or fork me and add that functionality. It would not be too hard. 

Don't abuse it :)
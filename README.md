# [Use It Or Lose It](https://use-it-or-lose-it.surge.sh/)

Use It Or Lose It or UIOLI, is a web application created to solve a very specific problem that I encountered while dealing with the good ol' credit score system that we all love some much. To build any sort of credit, most people rely on credit cards. They are relatively easy to get, and some give you awesome rewards. From cash back, signup bonuses to travel points, but I digress. 

Since "Length of Credit History", according to [Nerdwallet](https://www.nerdwallet.com/article/finance/fico-score), makes up 15% of your credit score, it's a pretty big deal if you close one of the credit card accounts. Even worse if this happens unbeknownst to you due to you forgetting to use one of your now 100 credit cards that you've accumulated over the years to get that sweet 750 on your credit score report. 

That is where Use It Or Lose It comes to the rescue! Simply signup using your email address, link your bank accounts using the [Plaid](https://plaid.com/) service and select the card usage frequency (most banks require a transaction at least once every 6-months). UIOLI will monitor your account activity and send you an email if you need to use your card, and you won't have to worry about losing your account or any reward points, so go ahead and book that trip to the Caribbean!

## Technical Information

### Front-End technologies used:
- ReactJS
- React Bootstrap
- JavaScript
- CSS

### Back-End technologies used: 
- NodeJS
- ExpressJS
- PostgreSQL
- bcryptJS
- JSON Web Tokens

### API used:
- Plaid API to link bank account to the web application
- Twilio/SendGrid to send email reminders

#

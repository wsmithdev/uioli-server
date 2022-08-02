const extractCreditCards = (accounts) => {
    let creditCards = []

    for (const account of accounts) {
        if (account.type === "credit") creditCards.push(account)
    }

    return creditCards
};

module.exports = {
  extractCreditCards,
};

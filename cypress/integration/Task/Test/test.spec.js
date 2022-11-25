///<reference types= "cypress"/>
const Locators = require("../page_Object/Locators");
const LoginLocators = require('../page_Object/LoginLocators')


let user = {
    Fname: "Sunil",
    Lname: "Chougale",
    email: `sunilc${Math.round(Math.random()*100000)}@gmail.com`,
    Pass: `testPass${Math.round((Math.random()*100000))}`,
    phone: "9222222222",
    addLine1: "Street Address sample 1",
    addLine2: "Street Address sample 2",
    city: "sample",
    state: "Alaska",
    zip: 41050,
    country: "USA",
    DressSize: "4",
    size: "3",
};
let CrediCard = {
    cardNO: "4242424242424242",
    cvv: "111",
    expDate: "0125",
};
let Coupon = {
    firstUsr: "1TIMEONLY",
    twentyPer: "20%OFF"
}

const mail = user.email

describe("Ts-01_ Varify the purchasing functionality", function () {
    it("Tc-01_Creating new Account and Purchase Using only Credit Card", function () {
        Locators.urlpage("register")
        Locators.First_name.type(user.Fname);
        Locators.Last_name.type(user.Lname);
        Locators.Email.type(mail);
        Locators.Password.type(user.Pass);
        Locators.CreateBtn.click();

        //Locators.PhoneNo.type(user.phone);
        cy.wait(1500);  //because execution speed is fast thats why used wait()
        Locators.confirmBtn.click();
        // assering the welcome text after successfull registeration.
        cy.contains(` Welcome Back, ${user.Fname}`).should('be.visible')

        cy.wait(9000); // popup removing time
        cy.get(".title-container").scrollIntoView();
        Locators.AddToCart.click();

        //for dress product
        // cy.get(".vs__search").click();
        // cy.get(`#vs1__option-${user.DressSize}`).click();

        //********************************************************* */
        //color of socks ==> yellow- 0, pink-1, blue- 2
        //cy.get(`:nth-child(${user.size}) > #save-button`).click()

        Locators.saveBtn.click();
        cy.wait(2000);
        Locators.DeliveryBtn.click();
        cy.wait(3000)
        Locators.DelAddLine1.type(user.addLine1);
        cy.wait(2000)
        Locators.DelAddLine2.type(user.addLine2);
        Locators.DelAddCity.type(user.city);
        Locators.DelState.select(user.state);
        Locators.DelAddZip.type(user.zip);
        Locators.DelCountry.select(user.country);
        Locators.DelAddSaveBtn.click();
        cy.wait(3000);
        Locators.CreditButton.click({ force: true });

        //iframe
        cy.get('[title="Secure card payment input frame"]').then(function (iframe1) {
            let body = iframe1[0].contentDocument.body;
            cy.wrap(body).as("bdy");
            cy.get("@bdy").find('[name="cardnumber"]').type(CrediCard.cardNO);
            cy.get("@bdy").find('[name="exp-date"]').type(CrediCard.expDate);
            cy.get("@bdy").find('[name="cvc"]').type(CrediCard.cvv);
            cy.get("@bdy").find('[name="postal"]').type(user.zip);
            Locators.AddCredCardBtn.click();
        });
        cy.wait(3000);
        cy.contains(' Pay With Card ').click()
        cy.wait(6000)
        //asserting the order confirmation 
        cy.get(".modal-body > div > h1").should(
            "have.text",
            "Thank you for your order!"
        );
        cy.get('#back').click()
        cy.contains(' Logout ').click()
        //asserting the url after logout 
        cy.url().should('contain', 'login')
    });

    it("Tc-02_Login with Existing user,Buying Product Using Coupon & CreditCard", function () {
        Locators.urlpage("login")
        LoginLocators.login(mail, user.Pass)
        // assering the welcome text after successfull login
        cy.contains(` Welcome Back, ${user.Fname}`).should('be.visible')

        cy.wait(3000)
        cy.get(".title-container").scrollIntoView();
        Locators.AddToCart.click();

        //for dress product
        // cy.get(".vs__search").click();
        // cy.get(`#vs1__option-${user.DressSize}`).click();

        //********************************************************* */
        //color of socks ==> yellow- 0, pink-1, blue- 2
        //cy.get(`:nth-child(${user.size}) > #save-button`).click()
        Locators.saveBtn.click();
        cy.wait(2000);
        LoginLocators.couponBtn.click()
        cy.wait(2000)
        LoginLocators.couponInputCOde.type(Coupon.twentyPer)
        cy.wait(3000)
        LoginLocators.savecoupon.click()
        cy.contains(' Pay With Card ').click()
        cy.wait(6000)
        cy.get(".modal-body > div > h1").should(
            "have.text",
            "Thank you for your order!"
        );
        cy.get('#back').click()
        cy.contains(' Logout ').click()

        cy.url().should('contain', 'login')
    })
});

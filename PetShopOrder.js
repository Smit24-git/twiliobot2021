const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    FOOD:   Symbol("food"),
    GROOMING_PRODUCT:   Symbol("grooming product"),
    TOYS:  Symbol("toys"),
    PAYMENT: Symbol("payment")
});

module.exports = class PetShopOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sPetFood = "";
        this.sGroomingProduct = "";
        this.sToys = "";
        this.sItem = "Pet Order";
        this.sPrice=0;
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
          case OrderState.WELCOMING:
                this.stateCur = OrderState.FOOD;
                aReturn.push("Welcome to Smit's Pet Shop.");
                aReturn.push("What pet food you want to purchase? <br/>( cat food | dog food | fish food )");
                
                break;
            case OrderState.FOOD:
                this.sPetFood = sInput;
    
                if(this.sPetFood.toLowerCase()=='cat food') this.sPrice+=10;
                else if(this.sPetFood.toLowerCase()=='dog food') this.sPrice+=12;
                else if(this.sPetFood.toLowerCase()=='fish food') this.sPrice+=14;
                else{
                  aReturn.push("Please Choose One of these: cat food | dog food | fish food");
                  break;
                }
                this.stateCur = OrderState.GROOMING_PRODUCT;
                aReturn.push("What Grooming Product would you like for your pet? <br/> ( brushes | combs | shampoo )");
                break;
            case OrderState.GROOMING_PRODUCT:
                this.sGroomingProduct = sInput;
                if(this.sGroomingProduct.toLowerCase()=='brushes') this.sPrice+=15;
                else if(this.sGroomingProduct.toLowerCase()=='combs') this.sPrice+=14;
                else if(this.sGroomingProduct.toLowerCase()=='shampoo') this.sPrice+=20;
                else{
                  aReturn.push("Please Choose One of these: brushes | combs | shampoo");
                  break;
                }
                this.stateCur = OrderState.TOYS;
                aReturn.push("Would you like Toys with that? <br/> (yes | no)");

                this.sPrice+=15;
                break;
            case OrderState.TOYS://final stage
                this.stateCur = OrderState.PAYMENT;
                if(sInput.toLowerCase() != "no"){
                    this.sToys = sInput;
                    this.sPrice+=5;
                }
                aReturn.push("Thank-you for your order of");
                aReturn.push(`Food: ${this.sPetFood}`);
                aReturn.push(`Grooming Product: ${this.sGroomingProduct}`);
                if(this.sToys){
                    aReturn.push(`Toys: ${this.sToys}`);
                }
                aReturn.push(`Price: ${this.sPrice}`);
                
                aReturn.push(`Please pay for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                
                break;
            case OrderState.PAYMENT:
                this.isDone(true);
                let d = new Date(); 
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                const shipping_details=sInput.purchase_units[0].shipping;

                aReturn.push('Name: '+shipping_details.name.full_name);
                aReturn.push('Address: '+Object.values(shipping_details.address).join());
                break;
        }
        return aReturn;
    }
    renderForm(){
      // your client id should be kept private
      const sClientID = process.env.SB_CLIENT_ID || 'AS3bY-KC1GsPBdIfzxWSXBmdq5WRJmDINDr0Y5McPQRHugsX0C309F4DVA8UIIoQkikbZFGmGEzU_ttX'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your order of $${this.sPrice}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.sPrice}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".",details,()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}
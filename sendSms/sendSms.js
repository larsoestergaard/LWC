/**
 * @description       : demo LWC to enable easy sending SMS
 * @author            : Lars Østergaard
 * @group             : 
 * @last modified on  : 06-24-2021
 * @last modified by  : Lars Østergaard
 * Modifications Log 
 * Ver   Date         Author            Modification
 * 1.0   03-19-2021   Lars Østergaard   Initial Version
**/
import { LightningElement, track, wire } from 'lwc';
import sendSms from '@salesforce/apex/SmsService.sendSms';
import getSmsWrapper from '@salesforce/apex/SmsService.getSmsWrapper';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SendSms extends LightningElement {
    validMobile = false;
    validSmsText = false;
    @track disableButton = true;
    result = null;
    error = null;

    @wire(getSmsWrapper) smsWrapper;

    handleSendSms(){
        if(this.validMobile === true && this.validSmsText === true){
            sendSms({smsWrapper: this.smsWrapper})
                .then(() => {
                    this.result = 'SMS sent';
                    this.fireResultEvent(this.result);
                    this.error = null;
                })
                .catch(error => {
                    this.fireResultEvent(error.body.pageErrors[0].message);
                    this.error  = error;
                    this.result = null;
                });
        }
    }

    handleMobileInputChange(event){
        this.validMobile = this.isMobileValid(event.target.value);
        if(this.validMobile === true){
            this.smsWrapper.mobilnr = event.target.value;
            this.smsWrapper.Mobil = event.target.value;
        }
        this.disableOrEnableButton();
        console.log('smsWrapper.mobilnr: ' + this.smsWrapper.mobilnr);
        console.log('smsWrapper.Mobil: ' + this.smsWrapper.Mobil);
    }

    handleSmsTextInputChange(event){
        this.validSmsText = this.isSmsTextValid(event.target.value);
        if(this.validSmsText === true){
            this.smsWrapper.smsText = event.target.value;
        }
        this.disableOrEnableButton();
        console.log('smsWrapper.smsText: ' + this.smsWrapper.smsText);
    }

    disableOrEnableButton(){
        this.disableButton = this.validSmsText === true && this.validMobile === true ? false : true;
    }

    isMobileValid(mobile){
        let validRegex = /^\d{8}$/;
        return (mobile.match(validRegex) ? true : false);
    }

    isSmsTextValid(smsText){
        return (smsText !== null && smsText !== '' ? true : false);
    }

    fireResultEvent(eventMessage){
        let evt = null;
        if(this.error === null && this.result !== null){
            evt = new ShowToastEvent({
                title: 'Success',
                message: eventMessage,
                variant: 'success',
                mode: 'dismissable'
            });
        } else if(this.result === null && this.error !== null){
            evt = new ShowToastEvent({
                title: 'Error',
                message: eventMessage,
                variant: 'error',
                mode: 'dismissable'
            });
        }
        if(evt !== null){
            this.dispatchEvent(evt);
        }
    }
}
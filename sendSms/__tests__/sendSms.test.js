import { createElement } from 'lwc';
import SendSms from 'c/sendSms';

describe('c-send-sms', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.
    async function flushPromises() {
        return Promise.resolve();
    }

    test('Testing disabled button at load', () => {
        const element = createElement('c-send-sms', { is: SendSms });
        document.body.appendChild(element);        
        const button = element.shadowRoot.querySelector('lightning-button[data-id=sendButton]');
        expect(button.disabled).toEqual(true);
    });

    test('Testing invalid mobile and valid text', async () => {
        const element = createElement('c-send-sms', { is: SendSms });
        document.body.appendChild(element);

        const mobileInput = element.shadowRoot.querySelector('lightning-input[data-id=mobileInput]');
        mobileInput.value = 'abc123de';
        mobileInput.dispatchEvent(new CustomEvent('change'));

        const textInput = element.shadowRoot.querySelector('lightning-input[data-id=textInput]');
        textInput.value = 'Some test text';
        textInput.dispatchEvent(new CustomEvent('change'));

        await flushPromises();
        const button = element.shadowRoot.querySelector('lightning-button[data-id=sendButton]');
        expect(button.disabled).toEqual(true);
    });

    test('Testing valid mobile and valid text', async () => {
        const element = createElement('c-send-sms', { is: SendSms });
        document.body.appendChild(element);

        const mobileInput = element.shadowRoot.querySelector('lightning-input[data-id=mobileInput]');
        mobileInput.value = '12345678';
        mobileInput.dispatchEvent(new CustomEvent('change'));

        const textInput = element.shadowRoot.querySelector('lightning-input[data-id=textInput]');
        textInput.value = 'Some test text';
        textInput.dispatchEvent(new CustomEvent('change'));
        
        await flushPromises();
        const button = element.shadowRoot.querySelector('lightning-button[data-id=sendButton]');
        expect(button.disabled).toEqual(false);
    });

    test('Testing valid mobile and invalid text', async () => {
        const element = createElement('c-send-sms', { is: SendSms });
        document.body.appendChild(element);

        const mobileInput = element.shadowRoot.querySelector('lightning-input[data-id=mobileInput]');
        mobileInput.value = '12345678';
        mobileInput.dispatchEvent(new CustomEvent('change'));

        const textInput = element.shadowRoot.querySelector('lightning-input[data-id=textInput]');
        textInput.value = '';
        textInput.dispatchEvent(new CustomEvent('change'));
        
        await flushPromises();
        const button = element.shadowRoot.querySelector('lightning-button[data-id=sendButton]');
        expect(button.disabled).toEqual(true);
    });
});
import React, { useState } from 'react';
import { Form, Input, Button , Message } from 'semantic-ui-react';
import CampaignInstance from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

function ContributeForm(props){
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        const campaign = CampaignInstance(props.address);

        setLoading(true);
        setErrorMessage("");

        try{
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            })

            Router.replaceRoute(`/campaigns/${props.address}`)
        } catch(err){
            setErrorMessage(err.message);
        }

        setLoading(false);
        setValue('');
    }


    return(
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to contribute</label>
                <Input
                    value={value}
                    onChange={event => {setValue(event.target.value)}}
                    label="ether"
                    labelPosition="right"
                    />
            </Form.Field>

            <Message error header="Oops!" content={errorMessage}/>
            <Button type="submit" loading={loading} primary>
                Contribute
            </Button>
        </Form>
    )
}

export default ContributeForm;
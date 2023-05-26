 import React, { useState } from 'react';
 import Layout from '../../components/Layout';
 import 'semantic-ui-css/semantic.min.css';
 import { Button, Form, Input, Message } from 'semantic-ui-react'
 import factory from '../../ethereum/factory';
 import web3 from '../../ethereum/web3';
 import { Router } from '../../routes';

 function CampaignNew(){
    const [minimumContribution, setMinimumContribution] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage("");

        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createNewCampaign(minimumContribution)
                .send({
                    from: accounts[0],
            })

            Router.pushRoute('/');
        } catch(err){
            setErrorMessage(err.message);
        }

        setLoading(false);
    }

    return(
        <Layout>
            <h3>Create a Campaign</h3>
            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input 
                        label="wei" 
                        labelPosition="right"
                        value={minimumContribution}
                        onChange={event => {setMinimumContribution(event.target.value)}}/>
                </Form.Field>
                <Message error header="Oops!" content={errorMessage}/>
                <Button loading={loading} primary type='submit'>Create</Button>
            </Form>
        </Layout>
    )
 }

 export default CampaignNew;
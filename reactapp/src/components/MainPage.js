import React, { Component } from "react";

import axios from "axios";
import { Card, Grid, Divider, Search } from "semantic-ui-react";

class MainPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			query: "",
			loading: false,
            results: [],
            useResults: [],
            result: "",
            doc: {}
		};
    }
    
    componentDidUpdate = (prevProps, prevState) => {
		if (prevState.results !== this.state.results) {
			if (this.state.results && this.state.results.length > 0) {
                let docs = [];
                for(var i = 0; i< this.state.results.length; ++i) {
                    let doc = this.state.results[i];
                    docs.push({ title: doc.name, description: doc.cast, price: doc.rating, id: doc.id });
                }
                this.setState({ useResults: docs });
			}
        }
        
        if(prevState.result !== this.state.result) {
            if(!this.state.result) return;

            axios.get(`/movies/${this.state.result}`).then(res => {
                this.setState({ doc: res.data });
            });
        }
	};

	// SEARCH FUNCTIONS
	onSearch = e => {
		clearTimeout(this.timer);
		this.setState({ results: [], query: e.target.value });
		this.timer = setTimeout(this.search, 1000);
    };
    
    handleResultSelect = (e, { result }) => {
        this.setState({ result: result.id, query: "" });
    }

	search = () => {
		if (!this.state.query) return;
		this.setState({ loading: true });
		axios.get(`/autocomplete/${this.state.query}`).then(res => {
            this.setState({ results: res.data, loading: false });
        });
	};
    
    render() {
        const { query, loading, useResults, doc } = this.state;

        return(            
            <Grid 
                columns={3} 
                textAlign="center"
                style={{  
                    backgroundColor: "#bcbcbc",
                    height: window.innerHeight
                }}
            >
                <Grid.Row>
                    <Grid.Column />
                    <Grid.Column style={{ padding: 5 }} textAlign="center">
                        <h1>Search Movies</h1>
                        <Search
                            fluid
                            size="huge"
                            loading={loading}
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={this.onSearch}
                            results={useResults}
                            value={query}
                        />
                        <Divider />
                        <div>
                            {doc && doc.length > 0 && (
                                <Card color="blue" fluid>
                                    <Card.Content>
                                        <Card.Header>{doc[0].name}</Card.Header>
                                        <Card.Meta>{doc[0].rating}</Card.Meta>
                                        <Card.Description>Cast: {doc[0].cast}</Card.Description>
                                    </Card.Content>
                                </Card>
                            )}
                        </div>
                    </Grid.Column>
                    <Grid.Column />
                </Grid.Row>
            </Grid>
        );
    }
}

export default MainPage;
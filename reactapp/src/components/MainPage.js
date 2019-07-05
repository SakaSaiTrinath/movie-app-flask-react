import React, { Component } from "react";

import axios from "axios";
import { Card, Grid, Divider, Search, Button, List, Icon } from "semantic-ui-react";

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
			if (this.state.results) {
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
        }).catch(err => {
            this.setState({ results: [], useResults: [], loading: false });
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
                        <Button icon="close" content="Clear" floated="right" onClick={() => this.setState({ doc: [] })} />
                        <br /><br /><br />
                        <div>
                            {doc && doc.length > 0 && (
                                <Card color="blue" fluid>
                                    <Card.Content>
                                        <Card.Header>{doc[0].name}</Card.Header>
                                        <Card.Meta>
                                            <Icon name="star" color="blue" />{" "}{doc[0].rating}
                                        </Card.Meta>
                                        <Card.Description>{doc[0].desc}</Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <List relaxed>
                                            <List.Item>
                                            <Icon name="certificate" color="blue" />{" "}{doc[0].certificate !== "Not Rated" ? doc[0].certificate : "No Certificate"}
                                            </List.Item>
                                            <List.Item>
                                            <Icon name="clock" color="blue" />{" "}{doc[0].runtime}
                                            </List.Item>
                                            <List.Item>
                                            <Icon name="tag" color="blue" />{" "}{doc[0].genre}
                                            </List.Item>
                                            <List.Item>
                                                <Icon name="film" color="blue" />{" "}{doc[0].director}
                                            </List.Item>
                                            <List.Item>
                                                <Icon name="users" color="blue" />{" "}{doc[0].cast}
                                            </List.Item>
                                            <List.Item>
                                                Votes: {doc[0].votes !== "-1" ? doc[0].votes : "No data"}
                                            </List.Item>
                                            <List.Item>
                                                <Icon name="dollar" color="blue" />{" "}{doc[0].gross !== "-1" ? doc[0].gross.substr(1,doc[0].length) : "No data"}
                                            </List.Item>
                                        </List>
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
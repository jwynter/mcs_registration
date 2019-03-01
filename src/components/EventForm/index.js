// @flow
// src/components/EventForm/index.js
import React, { PureComponent } from "react";
import { Form, FormGroup } from 'reactstrap';
import queryString from 'query-string';
import { getEvents } from "../../lib/api.js";
import EventForm from "./form.js"
import EventCheckinList from "./checkins.js"
import { sortByDate } from '../../lib/utils.js'

type State = {};

type Props = {};

class EventPage extends PureComponent<Props, State> {
  state: State = {
    selected: "",
    eventList: []
  };

  componentDidMount() {
    var parsedSearch = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      var eventId = parsedSearch["uid"];
      if (eventId) {
        this.setState({selected: eventId});
      }
    }

    getEvents.on("value", (snapshot) => {
      var eventList = [];
      var eventsSnap = snapshot.val();
      if (eventsSnap) {
        Object.keys(eventsSnap).forEach((uid => {
          eventList.push(Object.assign({uid: uid}, eventsSnap[uid]))
        }))
        eventList.sort(sortByDate)
      }
      this.setState({eventList: eventList});
    });
  };

  onEventSelectChange = (event: any) => {
    var value = event.target.value;
    this.setState({
      selected: value
    });
    window.location.href = "/admin/event?uid=" + encodeURIComponent(value);
  };

  render() {

    return (
      <div className="App">
        <h1>Event</h1>
        <div>
          <p>Select a event to view or update, or create a new event.</p>
          <Form>
            <FormGroup>
              <select onChange={this.onEventSelectChange} value={this.state.selected}>
                <option value="">Create a New Event</option>
                {this.state.eventList.map((event) => {
                  return(
                    <option key={event.uid} value={event.uid}>{event.date}, {event.title}</option>
                  )
                })}
              </select>
            </FormGroup>
          </Form>
        </div>
        <br></br>
        <div>
          <h4>Event Form</h4>
          <EventForm {...this.props} ></EventForm>
        </div>
        <br></br>
        {this.state.selected && 
          <div>
            <EventCheckinList {...this.props}></EventCheckinList>
          </div>          
        }
      </div>
    );
  }
}

export default EventPage;

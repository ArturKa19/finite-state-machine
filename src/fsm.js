class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config == undefined) throw new Error("Config isn't exist!");
        this.currentState = config.initial;
        this.allStates = config.states;
        this.initState = config.initial;
        this.isRedo = false;
        this.history = {
            lastState : [this.initState],
            index : 0,
            count: 0
        };
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(state==="hungry" || state==="normal" || state==="busy" || state==="sleeping"){
            this.history.lastState.push(state);
            this.history.count++;
            this.history.index++;
            this.currentState = state;
            this.isRedo = false;
        }
        else throw new Error("There are no such state!");

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let tempState = this.allStates[this.currentState].transitions[event];
        if(tempState == undefined){
            throw new Error("There are no such event!");
        }else{
            this.changeState(tempState);
        }
        this.isRedo = false;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        return this.currentState = this.initState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let stateArr = [];
        if(event == undefined){
            for(let state in this.allStates){
                stateArr.push(state);
            }
        }else{
            for(let state in this.allStates){
                if(this.allStates[state].transitions[event] != undefined)
                    stateArr.push(state);
            }
        }

        return stateArr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        let pos;
        if(this.history.index == 0)
            pos = false;
        else{
            this.currentState = this.history.lastState[this.history.index-1];
            this.history.index--;
            pos = true;
        }
        this.isRedo = true;
        return pos;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        let pos;
        if(this.history.index == this.history.count || this.history.count == this.history.lastState.length || !this.isRedo)
            pos = false;
        else{
            this.currentState = this.history.lastState[this.history.index+1];
            this.history.index++;
            pos = true;
        }
        return pos;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history.count = 0;
        this.history.index = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

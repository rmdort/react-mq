var React = require('react');
var _matchMediaFunction = window && window.matchMedia && function (mediaQueryString) {
  return window.matchMedia(mediaQueryString);
};

var globalMediaQueries = {};
var globalMediaQueryList = {};

function removeMediaQuery (mediaQuery, mediaQueryList){
    var mq = mediaQueryList[mediaQuery];
    if(mq){
        mq.mql.removeListener(mq.listener);
        mediaQueryList[mediaQuery] = null;
    }
}

var Mixin = {
    // Component scope
    componentMediaQueryList: {},

    getInitialState: function() {
        return {
            media: {}
        };
    },

    componentWillMount: function(){
        var query = this.getMediaQuery();
        if(query){
            this.updateMediaQuery(query);
        }else{
            this.listenGlobalMediaQueries();
            this.listenComponentMediaQueries();
        }

    },

    componentWillUnmount: function(){
        if(this.mql){
            this.mql.removeListener(this.updateMatches);
        }else{
            Object.keys(this.componentMediaQueryList).forEach(function(key){

            })
        }
    },

    addMediaQueries: function(mediaQueries){
        for(var mediaQuery in mediaQueries){
            if(mediaQueries.hasOwnProperty(mediaQuery)){
                globalMediaQueries[mediaQuery] = mediaQueries[mediaQuery];
            }
        }
    },

    removeMediaQuery: function(mediaQuery){
        removeMediaQuery(mediaQuery, globalMediaQueryList);
    },

    listenGlobalMediaQueries: function(){
        this.listenMediaQueries(globalMediaQueries, globalMediaQueryList);
        // Reset global media query after listened
        globalMediaQueries = {};
    },

    listenComponentMediaQueries: function(componentMediaQueries){
        if(this.media){
            this.listenMediaQueries(this.media, this.componentMediaQueryList);
        }
    },

    setMediaQueryState: function(key, doesMatch) {
        if (this.state.media[key] != doesMatch) {
            this.state.media[key] = doesMatch;
            this.setState({
                media: this.state.media
            });
        }
    },

    listenMediaQueries: function(mediaQueries, mediaQueryLists){
        var self = this;
        Object.keys(mediaQueries).forEach(function(key){
            mediaQueryLists[key] = {};

            var mediaQuery = mediaQueries[key];
            var mql = _matchMediaFunction(mediaQuery);
            mediaQueryLists[key].mql = mql;

            // Create listener
            var listener = function(mql){
                self.setMediaQueryState(key, mql.matches);
            };

            mediaQueryLists[key].listener = listener;

            listener(mql);

            // Listen for changes
            mql.addListener(listener);
        })
    },

    getMediaQuery: function(){
        var query = this.props.query;
        return query;
    },

    updateMediaQuery: function(query){
        if (!query) {
            throw new Error('Invalid or missing Media Query');
        }

        if(_matchMediaFunction){
            this.mql = _matchMediaFunction(query);
            this.mql.addListener(this.updateMatches);
            this.updateMatches();
        }
    },

    updateMatches: function(){
        if (this.mql.matches === this.state.matches) {
            return;
        }
        this.setState({
            matches: this.mql.matches
        });
    }
};

var MediaQuery = React.createClass({
    mixins: [Mixin],

    statics: {
        add: function(name, query, override){
            if(media[name] && !override){
                throw new Error('Set duplicate media alias');
            }
            media[name] = query;
        }
    },

    getInitialState: function(){
        return {
            matches: false
        };
    },

    render: function(){
        if (this.state.matches === false) {
            return null;
        }
        return React.DOM.div(this.props, this.props.children);
    }
});

MediaQuery.Mixin = Mixin;

module.exports = MediaQuery;

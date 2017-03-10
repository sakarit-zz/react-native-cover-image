'use strict'

import React, {Component, PropTypes} from 'react'
import {Dimensions, StyleSheet, View, Animated, ScrollView, Image, TouchableWithoutFeedback} from 'react-native'


const
  {width: WIDTH} = Dimensions.get('window'),
  PADDING = Math.round(WIDTH * .05),
  PADDED_WIDTH = Math.round(WIDTH * 1.1)


class CoverImage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0)
    }

    this.onScroll = this.onScroll.bind(this)
    this.onPress = this.onPress.bind(this)
  }

  render() {
    const
      {source, content, contentContainerStyle, backgroundColor, onPress, children} = this.props,
      {scrollY} = this.state,
      opacity = scrollY.interpolate({inputRange: [0, WIDTH], outputRange: [1, .2]}),
      size = scrollY.interpolate({inputRange: [-WIDTH, 0, WIDTH], outputRange: [WIDTH + PADDED_WIDTH, PADDED_WIDTH, WIDTH]})

    return (
      <View style={styles.container}>
        <View style={[styles.image, {backgroundColor}]}>
          <Animated.Image
            style={[
              styles.animated,
              {opacity, width: size, height: size}
            ]}
            source={source}
          >
            <View style={styles.content}>
              {content}
            </View>
          </Animated.Image>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          onScroll={this.onScroll}
          scrollEventThrottle={16}
        >
          <TouchableWithoutFeedback
            ref="touchable"
            onPress={this.onPress}
          >
            <View style={styles.touchable} />
          </TouchableWithoutFeedback>
          <View style={[{backgroundColor}, contentContainerStyle]}>
            {children}
          </View>
        </ScrollView>
      </View>
    )
  }

  onScroll({nativeEvent: {contentOffset: {y}}}) {
    const {scrollY} = this.state
    scrollY.setValue(y)
  }

  onPress() {
    const {onPress} = this.props
    this.refs.touchable.requestAnimationFrame(() =>
      onPress && onPress()
    )
  }

}

CoverImage.propTypes = {
  source: Image.propTypes.source,
  content: PropTypes.element,
  contentContainerStyle: ScrollView.propTypes.contentContainerStyle,
  backgroundColor: PropTypes.string.isRequired,
  onPress: PropTypes.func
}

CoverImage.defaultProps = {
  backgroundColor: 'black'
}

export default CoverImage


const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    margin: -PADDING,
    width: PADDED_WIDTH,
    alignItems: 'center',
  },
  animated: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    resizeMode: 'cover',
  },
  content: {
    width: WIDTH,
    height: PADDED_WIDTH,
    paddingVertical: PADDING,
  },
  touchable: {
    width: WIDTH,
    height: WIDTH,
  },
  scrollContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  }
})

import * as React from 'react'
import {mount} from 'enzyme'
import IndexPage from '../pages/index'
import {Provider} from "react-redux";
import store from "../store/store";

describe('Pages', () => {
    describe('Index', () => {
        const wrap = mount(<Provider store={store}><IndexPage/></Provider>)
        it('should render without throwing an error', function () {
            expect(wrap)
        })
        it('should have select', function () {
            expect(wrap.exists('select')).toBe(true)
        })
        it('should have Link to [:id]', function () {
            expect(wrap.exists('Link')).toBe(true)
        })
        it('should have russian language', function () {
            expect(wrap.exists("option[value='ru']")).toBe(true)
        })
        it('should have english language', function () {
            expect(wrap.exists("option[value='en']")).toBe(true)
        })
        it('should have germany language', function () {
            expect(wrap.exists("option[value='ge']")).toBe(true)
        })
        it('should have search', function () {
            expect(wrap.exists('input#search')).toBe(true)
        })
        it('should have file input', function () {
            expect(wrap.exists('input#file')).toBe(true)
        })
        it('should have login form', function () {
            expect(wrap.exists('form#Login')).toBe(true)
        })
        it('should have register form', function () {
            expect(wrap.exists('form#Register')).toBe(true)
        })
    })
})

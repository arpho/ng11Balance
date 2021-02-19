// tslint:disable:semicolon
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { QuestionBase } from './question-base';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { MockCategoriesService } from 'src/app/models/mockers/mockCategoriesService';
// tslint:disable-next-line: quotemark
describe("testing filterFunction", () => {
    const filterFunction = (value: string, item: CategoryModel) => {
        return item && item.title ? item.title.includes(value) : false
    }
    const question = new QuestionBase<string>({ order: 0, key: 'test', label: 'test', value: 'text to be tested', filterFunction })
    it('filterfunction is defined', () => {
        expect(question.filterFunction).toBeTruthy()
    })
    it('base filterFunction should work properly', () => {
        const options = { test: 'ali' }
        const cat = new CategoryModel('alimenti',).initialize({key:'alimenti',title:'alimenti'})
        
        const filterFunction2testTrue = question.filterFactory(options)
        
        expect(filterFunction2testTrue(cat)).toBeTruthy()
        options.test = 'veg'
        const filterFunction2testFalse = question.filterFactory(options)
        expect(filterFunction2testFalse(cat)).toBeFalsy()
    })
    it('base filterFunction should return false', () => {
        // expect(question.filterFunction('abcd')).toBe(false)
    })
    it('testing neutral function', () => {
        const options = { Test: 'no filter' }
        // tslint:disable-next-line: no-shadowed-variable
        const filterFunction = (value: string, item: CategoryModel) => item.title.includes(value)
        const Question = new QuestionBase<string>({ order: 0, key: 'test', label: 'test', value: 'neutralFilter', filterFunction })
        const cat = new CategoryModel('a', )
        const neutralFilter = Question.filterFactory(options)
        expect(neutralFilter(cat)).toBeTruthy()


    })
    it('filterFactory should return neutralFilter', () => {
        const filter = question.filterFactory({ test: '' })

        expect(filter(new CategoryModel())).toBe(true)
    })
})

import { Component } from 'react';
import * as apiService from './apiservice';


export class AppService extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * 
     * 
     * Users Section
     * 
     * 
     * 
     */

    /**
     * This method returns all
     */
    async getConversationTree() {
        return await apiService.get('trees');
    }


    /**
 * 
 * 
 * Categories Section
 * 
 * 
 * 
 */

    /**
     * This method returns all categories
     */
    async getAllCategories() {
        return await apiService.get('categories');
    }


    /***
     * Companies Section Srtarts
     */








    /**
     * 
     * 
     * Products Section
     * 
     * 
     * 
     */

    /**
     * This method returns all products
     */
    async getAllProducts() {
        return await apiService.get('products');
    }





    /**
     * 
     * ----- COMPANIES SECTION STARTS HERE -----
     * 
     */


    /**
     * 
     * @param {*} data 
     * This method creates a new company
     */
    async createCompany(data) {
        return await apiService.post('companies', data);
    }



    /**
     *  This method gets all companies
     */
    async getAllCompanies() {
        return await apiService.get('companies');
    }


    /**
     * 
     * @param {*} id 
     * 
     * This method gets a company by it's Id
     */
    async getCompanyId(id) {
        return await apiService.get('companies', id);

    }


    /**
     * 
     * @param {*} id 
     * 
     * This method deletes a company
     */
    async deleteCompany(id) {
        return await apiService.del('companies', id);
    }


    /**
     * 
     * @param {*} id 
     * @param {*} data 
     * 
     * This method updates a company
     */
    async updateCompany(id, data) {
        const url = `companies/${id}`;
        return await apiService.put(url, data);
    }


    /**
     * 
     * @param {*} id 
     * @param {*} data 
     * 
     * This method toggles a company's enabled status
     */

    async toggleCompany(id, data) {
        const url = `companies/${id}`;
        return await apiService.patch(url, data);
    }





    //FORMS AREA


    /**
   * 
   * @param {*} data 
   * This method creates a new Form
   */
    async createForm(data) {
        return await apiService.post('forms', data);
    }

    /**
     *  This method gets all forms
     */
    async getAllForms() {
        return await apiService.get('forms');
    }


    /**
     * 
     * @param {*} id 
     * 
     * This method gets a Form by it's Id
     */
    async getFormById(id) {
        return await apiService.get('forms', id);

    }


    /**
     * 
     * @param {*} id 
     * 
     * This method deletes a Form
     */
    async deleteForm(id) {
        const url = `forms/${id}`;
        return await apiService.del(url);
    }


    /**
     * 
     * @param {*} id 
     * @param {*} data 
     * 
     * This method updates a Form
     */
    async updateForm(id, data) {
        const url = `forms/${id}`;
        return await apiService.put(url, data);
    }


    /**
     * 
     * @param {*} id 
     * @param {*} data 
     * 
     * This method toggles a Form's enabled status
     */

    async toggleForm(id, data) {
        const url = `forms/${id}`;
        return await apiService.patch(url, data);
    }

}
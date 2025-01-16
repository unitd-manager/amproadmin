import React from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';

function TabPassTypeTab({ tabPassTypeDetails, handlePassTypeInputs }) {
  TabPassTypeTab.propTypes = {
    tabPassTypeDetails: PropTypes.object,
    handlePassTypeInputs: PropTypes.func,
  };

  return (
    <div>
      <Row>
      <Col md="4">
        <FormGroup>
          <Label>
            Pass Type <span style={{ color: 'red' }}>*</span>
          </Label>
          <Input
            name="citizen"
            value={tabPassTypeDetails && tabPassTypeDetails.citizen}
            type="select"
            onChange={handlePassTypeInputs}
          >
            <option value="">Please Select</option>
            <option defaultValue="selected" value="Citizen">
              Citizen
            </option>
            <option value="PR">PR</option>
            <option value="EP">EP</option>
            <option value="SP">SP</option>
            <option value="WP">WP</option>
            <option value="DP">DP</option>
          </Input>
        </FormGroup>
      </Col>
      {tabPassTypeDetails.citizen === 'Citizen' && (
        <Col md="4">
          <FormGroup>
            <Label>
              NRIC No <span style={{ color: 'red' }}>*</span>
            </Label>
            <Input
              name="nric_no"
              value={tabPassTypeDetails && tabPassTypeDetails.nric_no}
              type="text"
              onChange={handlePassTypeInputs}
            />
          </FormGroup>
        </Col>
      )}
      </Row>
      {tabPassTypeDetails.citizen === 'SP' && (
        <Row>
          {' '}
          <Col md="4">
            <FormGroup>
              <Label>
                Fin No <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input
                name="fin_no"
                value={tabPassTypeDetails && tabPassTypeDetails.fin_no}
                type="text"
                onChange={handlePassTypeInputs}
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Fin No Expiry date</Label>
              <Input
                name="fin_no_expiry_date"
                value={moment(tabPassTypeDetails && tabPassTypeDetails.fin_no_expiry_date).format(
                  'YYYY-MM-DD',
                )}
                type="date"
                onChange={handlePassTypeInputs}
              />
            </FormGroup>
          </Col>
        </Row>
      )}
      {tabPassTypeDetails.citizen === 'EP' && (
        <Row>
          {' '}
          <Col md="4">
            <FormGroup>
              <Label>
                Fin No <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input
                name="fin_no"
                value={tabPassTypeDetails && tabPassTypeDetails.fin_no}
                type="text"
                onChange={handlePassTypeInputs}
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Fin No Expiry date</Label>
              <Input
                name="fin_no_expiry_date"
                value={moment(tabPassTypeDetails && tabPassTypeDetails.fin_no_expiry_date).format(
                  'YYYY-MM-DD',
                )}
                type="date"
                onChange={handlePassTypeInputs}
              />
            </FormGroup>
          </Col>
        </Row>
      )}
      {tabPassTypeDetails.citizen === 'PR' && (
        <Row>
          {' '}
          <Col md="4">
            <FormGroup>
              <Label>
                NRIC No <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input
                name="nric_no"
                value={tabPassTypeDetails && tabPassTypeDetails.nric_no}
                type="text"
                onChange={handlePassTypeInputs}
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>SPR Year</Label>
              <Input
                name="spr_year"
                value={tabPassTypeDetails && tabPassTypeDetails.spr_year}
                onChange={handlePassTypeInputs}
                type="select"
              >
                <option defaultValue="selected">Please Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
      )}

      {tabPassTypeDetails.citizen === 'DP' && (
        <Row>
          {' '}
          <Col md="4">
            <FormGroup>
              <Label>
                Fin No <span style={{ color: 'red' }}>*</span>
              </Label>
              <Input
                name="fin_no"
                value={tabPassTypeDetails && tabPassTypeDetails.fin_no}
                type="text"
                onChange={handlePassTypeInputs}
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <Label>Fin No Expiry date </Label>
              <Input
                name="fin_no_expiry_date"
                value={moment(tabPassTypeDetails && tabPassTypeDetails.fin_no_expiry_date).format(
                  'YYYY-MM-DD',
                )}
                type="date"
                onChange={handlePassTypeInputs}
              />
            </FormGroup>
          </Col>
        </Row>
      )}
      {tabPassTypeDetails.citizen === 'WP' && (
        <>
          {' '}
          <Row>
            <Col md="4">
              <FormGroup>
                <Label>
                  Fin No <span style={{ color: 'red' }}>*</span>
                </Label>
                <Input
                  name="fin_no"
                  value={tabPassTypeDetails && tabPassTypeDetails.fin_no}
                  type="text"
                  onChange={handlePassTypeInputs}
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Fin No Expiry date </Label>
                <Input
                  name="fin_no_expiry_date"
                  value={moment(tabPassTypeDetails && tabPassTypeDetails.fin_no_expiry_date).format(
                    'YYYY-MM-DD',
                  )}
                  type="date"
                  onChange={handlePassTypeInputs}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <FormGroup>
                <Label>Work Permit No <span style={{ color: 'red' }}>*</span> </Label>
                <Input
                  name="work_permit"
                  value={tabPassTypeDetails && tabPassTypeDetails.work_permit}
                  type="text"
                  onChange={handlePassTypeInputs}
                />
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Work Expiry date </Label>
                <Input
                  name="work_permit_expiry_date"
                  value={moment(
                    tabPassTypeDetails && tabPassTypeDetails.work_permit_expiry_date,
                  ).format('YYYY-MM-DD')}
                  type="date"
                  onChange={handlePassTypeInputs}
                />
              </FormGroup>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default TabPassTypeTab;

/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import React from 'react';

export class ManualPlaceholder extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <svg {...this.props} style={this.props.style} version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 350 350" enable-background="new 0 0 350 350">
        <g>
          <path fill={this.props.style.colorOne} d="M328.4,173.8c0,3.9-0.1,7.8-0.4,11.6c0,0.1,0,0.1,0,0.2c0,0,0,0.1,0,0.1c-6.1,79.3-72.3,141.7-153.1,141.7
                c-4.7,0-9.4-0.2-14-0.6c-2-0.2-3.9-0.4-5.9-0.6c-75.4-9.8-133.7-74.2-133.7-152.3C21.2,89,90,20.2,174.8,20.2
                c80.8,0,147.1,62.5,153.1,141.7C328.2,165.9,328.4,169.8,328.4,173.8z"/>
          <path opacity="0.2" d="M328.5,187c-3.8,43-25.9,83.1-60.4,109.1c-16.8,12.7-36.1,21.9-56.5,26.8c-10.5,2.5-21.3,4-32.1,4.2
                c-5.3,0.1-10.6,0-15.8-0.4c-3.2-0.2-6.4-0.6-9.6-1c-3.1-0.4-9.1-0.4-11.7-2.1c-2.3-1.5-4.4-5.5-6.1-7.7c-2-2.5-4.1-5.1-6.1-7.6
                c-4.1-5.2-8.2-10.3-12.3-15.5c-8-10.1-16-20.1-24-30.2c-5-6.3-10.3-12.6-15-19.1c-10.5-14.4-17.6-31.1-20.8-48.7
                c-7-38.9,6.2-79.8,34.7-107.2c30.1-28.9,74.1-40.1,114.4-29c17,4.7,32.9,13.2,46.2,24.7c8.6,7.4,15.5,16.3,22.6,25.1
                c16.3,20.5,32.6,41,48.9,61.5c0.9,1.2,2.1,2.4,2.9,3.6C330.2,177.3,328.9,182.6,328.5,187z"/>
          <path fill={this.props.style.colorTwo} d="M293.9,173.7c0,3-0.1,6-0.3,9c0,0,0,0.1,0,0.1c0,0,0,0.1,0,0.1c-0.1,1.6-0.3,3.2-0.5,4.8
                c-0.6,5.4-1.6,10.7-3,15.9c-3.2,12.5-8.5,24.3-15.3,34.8c-6.9,10.7-15.5,20.2-25.4,28.2c-6.2,5-12.9,9.4-20.1,13.1
                c-1.3,0.7-2.6,1.3-3.9,1.9c-15,7.1-31.6,11.1-49.2,11.3c-0.5,0-1,0-1.5,0c-3.7,0-7.3-0.2-10.9-0.5c-11-1-21.5-3.5-31.4-7.2
                c-45-17.1-77-60.6-77-111.5c0-65.9,53.4-119.2,119.2-119.2C240.6,54.5,293.9,107.9,293.9,173.7z"/>
          <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="107.273" y1="116.9899" x2="280.3564" y2="290.0733">
                <stop offset="0" style={{stopColor: '#000000'}} />
                <stop offset="0.2778" style={{stopColor: '#020202', stopOpacity: '0.7222'}} />
                <stop offset="0.4155" style={{stopColor: '#0A0A0A', stopOpacity: '0.5845'}} />
                <stop offset="0.5223" style={{stopColor: '#171717', stopOpacity: '0.4777'}} />
                <stop offset="0.6133" style={{stopColor: '#2A2A2A', stopOpacity: '0.3867'}} />
                <stop offset="0.6943" style={{stopColor: '#424242', stopOpacity: '0.3057'}} />
                <stop offset="0.768" style={{stopColor: '#606060', stopOpacity: '0.232'}} />
                <stop offset="0.8364" style={{stopColor: '#848484', stopOpacity: '0.1636'}} />
                <stop offset="0.9005" style={{stopColor: '#ADADAD', stopOpacity: '9.945846e-02'}} />
                <stop offset="0.959" style={{stopColor: '#DADADA', stopOpacity: '4.098219e-02'}} />
                <stop offset="1" style={{stopColor: '#FFFFFF', stopOpacity: '0'}} />
          </linearGradient>
          <path opacity="0.25" fill="url(#SVGID_1_)" d="M209.5,113.3c0.2,0,0.4,0.1,0.5,0.2C209.9,113.4,209.7,113.4,209.5,113.3z
                 M305.5,223.7c1,1.2,1.5,1.7,1.6,1.8C306.9,225.3,305.7,223.8,305.5,223.7z M271.4,180.4c-14.9-19-30.8-36.7-47.8-53.8
                c-3.6-3.6-7.1-7.8-11-11.1c-1.6-1.4-2.6-1.6-4.5-2.1c-0.6-0.2,0.7,1.3-1.3,0.5c-1-0.4-2.2-2.9-2.8-3.7c-4.4-5.9-8.5-14.8-16.5-9.5
                c-4.5,3-8.7,8.1-5.2,13.1c1.1,1.6,2.2,2.8,3.3,4.2c2.4,3.1,4.5,5.7,6.8,8.6c1.2,1.5,2.6,2.6,3.4,4.3c0.1,0.2,1,1,1,1.3
                c0.1,1.9-2.9,4.9-3.2,7c-0.3,2.6,0.6,4.4,2.2,6.4c0.7,0.8,1.7,1.5,1.5,2.3c-0.4,2.3-7.1,6.9-8.7,8.4c-4.4,4.2-8.8,8.5-13.2,12.7
                c-2.7,2.6-5.4,5.2-8.1,7.8c-0.7,0.7-1.9,2.5-2.9,2.8c-2.4,0.7-8.7-7.4-10.9-9.6c-8.1-8.2-16.1-16.5-23.6-25.3
                c-3.5-4-6.6-8.4-10.2-12.4c-3.6-4-8.2-6.9-12.7-9.8c-2.4-1.6-2.1-2-4.2-0.8c-0.6,0.3-2.7,2.3-2.9,2.9c-0.8,2.5,7.7,11.7,9.4,14.1
                c7.8,10.6,16.1,21,24.3,31.4c4.2,5.3,8.4,10.7,12.7,16.1c1.5,1.9,4.9,5,4.2,6.9c-0.8,2.1-5.4,5.3-6.9,6.9c-4.4,4.5-8.7,9-13.3,13.2
                c-3,2.8-11.9,7.6-7.2,12.4c0.1,0.2,1,1.3,1.7,2.1c-0.1-0.1,1.3,1.6,1.3,1.6c0.2,0.2,1.7,2.5,1.3,1.7c1.3,2,3.7,4.5,4,5
                c0.5,0.7,1.8,2.2,1.8,2.3c1,1.3,1.7,2.1,2.6,3.3c0.5,0.7,2,2.7,1.8,2.2c0.1,0.2,1.9,2.5,1.9,2.5c-0.1-0.1,2.2,2.9,2,2.5
                c0.7,1.1,1.1,1.5,1.9,2.5c0.2,0.3,1,1.2,1.7,2.1c0.6,0.9,2.7,3.4,2.6,3.2c1.6,2.3,2.4,3.6,4.2,5.4c-0.3-0.4,1.2,1.4,1.7,2.1
                c0.7,1.1,4,4.8,4.3,5.4c1.6,2.3,2.4,3.6,4.2,5.4c-0.3-0.4,1.2,1.4,1.7,2.1c0.7,1,4,4.9,4.3,5.4c1.6,2.3,2.4,3.6,4.2,5.4
                c-0.3-0.4,1.2,1.4,1.7,2.1c0.4,0.5,1.4,1.5,2.3,2.9c0.6,0.8,9.9-0.4,12.2-0.6c4.6-0.5,9.1-1.3,13.6-2.3c8.6-2,20.5-4.4,26.3-11.3
                c2,1.9,5.1-0.9,7.4-2.2c2.6-1.5,5.1-3.2,7.6-4.9c2.1-1.4,6.1-3.5,5.8-5.5c-0.1-0.8-1.7-2-2.1-2.8c-1.3-2.6-1.4-1.5-0.1-3.7
                c3-5,9.2-9.7,13.3-14c2.2-2.3,4.4-4.6,6.7-6.9c0.7-0.7,2-2.7,3-3c1.9-0.7,1.1,0.3,3.2,1.5c2.6,1.6,2.4,1,4.1-1.8
                c1.5-2.4,2.9-4.9,4.1-7.5c2.6-5.1,4.8-10.4,6.7-15.8c0.6-1.9,2.8-6.2,2.5-8.3c-0.3-2.1-4.6-5.7-6-7.5
                C279.9,190.9,275.6,185.7,271.4,180.4C259.3,165,277.6,188.2,271.4,180.4z M121.8,222.2c0.1-0.9,0.4-1.8,1.1-2.6
                C122.3,220.6,121.9,221.4,121.8,222.2z M271.7,298.7C271.7,298.9,271.7,298.7,271.7,298.7C271.7,298.7,271.7,298.7,271.7,298.7z
                 M271.6,298.7C271.6,298.8,271.7,298.7,271.6,298.7C271.6,298.7,271.6,298.7,271.6,298.7z M271.4,295.9
                C271.4,295.9,271.4,295.9,271.4,295.9C271.4,295.9,271.4,295.9,271.4,295.9z M271.3,295.8C271.3,295.6,271.4,296.1,271.3,295.8
                C271.3,295.8,271.4,295.8,271.3,295.8z M271,294.8c0,0.3,0.1,0.5,0.2,0.8C271.2,295.3,271.1,295,271,294.8
                C271,294.8,271.1,295,271,294.8z M271,294.6C271,294.6,271.1,295,271,294.6C271,294.6,271,294.7,271,294.6z M254.2,304.7
                C254.2,304.7,254.3,304.7,254.2,304.7C254.2,304.6,254.2,304.6,254.2,304.7z"/>
          <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="271.6869" y1="299.7252" x2="271.8177" y2="299.8561">
                <stop offset="0" style={{stopColor: '#000000'}} />
                <stop offset="0.2778" style={{stopColor: '#020202', stopOpacity: '0.7222'}} />
                <stop offset="0.4155" style={{stopColor: '#0A0A0A', stopOpacity: '0.5845'}} />
                <stop offset="0.5223" style={{stopColor: '#171717', stopOpacity: '0.4777'}} />
                <stop offset="0.6133" style={{stopColor: '#2A2A2A', stopOpacity: '0.3867'}} />
                <stop offset="0.6943" style={{stopColor: '#424242', stopOpacity: '0.3057'}} />
                <stop offset="0.768" style={{stopColor: '#606060', stopOpacity: '0.232'}} />
                <stop offset="0.8364" style={{stopColor: '#848484', stopOpacity: '0.1636'}} />
                <stop offset="0.9005" style={{stopColor: '#ADADAD', stopOpacity: '9.945846e-02'}} />
                <stop offset="0.959" style={{stopColor: '#DADADA', stopOpacity: '4.098219e-02'}} />
                <stop offset="1" style={{stopColor: '#FFFFFF', stopOpacity: '0'}} />
          </linearGradient>
          <path fill="url(#SVGID_2_)" d="M271.8,299.7C271.8,299.7,271.8,299.7,271.8,299.7L271.8,299.7C271.7,300,271.7,300,271.8,299.7
                C271.8,299.7,271.7,300,271.8,299.7z"/>
          <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="271.5913" y1="297.4818" x2="271.851" y2="297.7415">
                <stop offset="0" style={{stopColor: '#000000'}}/>
                <stop offset="0.2778" style={{stopColor: '#020202', stopOpacity: '0.7222'}} />
                <stop offset="0.4155" style={{stopColor: '#0A0A0A', stopOpacity: '0.5845'}} />
                <stop offset="0.5223" style={{stopColor: '#171717', stopOpacity: '0.4777'}} />
                <stop offset="0.6133" style={{stopColor: '#2A2A2A', stopOpacity: '0.3867'}} />
                <stop offset="0.6943" style={{stopColor: '#424242', stopOpacity: '0.3057'}} />
                <stop offset="0.768" style={{stopColor: '#606060', stopOpacity: '0.232'}} />
                <stop offset="0.8364" style={{stopColor: '#848484', stopOpacity: '0.1636'}} />
                <stop offset="0.9005" style={{stopColor: '#ADADAD', stopOpacity: '9.945846e-02'}} />
                <stop offset="0.959" style={{stopColor: '#DADADA', stopOpacity: '4.098219e-02'}} />
                <stop offset="1" style={{stopColor: '#FFFFFF', stopOpacity: '0'}} />
          </linearGradient>
          <path fill="url(#SVGID_3_)" d="M271.7,297.7c0-0.1,0-0.2,0-0.3c0,0.2,0,0.3,0.1,0.5C271.8,297.8,271.7,297.7,271.7,297.7
                C271.7,297.7,271.7,297.7,271.7,297.7z"/>
          <path fill="#999999" d="M211.7,117.8l-11.6,11.6c-0.7-3.1-2.4-6.3-5-8.9c-2.6-2.6-5.8-4.3-8.9-5l11.7-11.7c0.7,3.2,2.4,6.3,5,9
                c0.5,0.5,1,0.9,1.5,1.4c0.1,0.1,0.2,0.1,0.3,0.2c0.1,0,0.1,0.1,0.2,0.1c0,0,0,0,0,0c0.1,0.1,0.1,0.1,0.2,0.2l0,0
                c0.1,0,0.1,0.1,0.2,0.2c0.1,0,0.1,0.1,0.2,0.1c0,0,0,0,0,0c0,0,0,0,0,0c0.1,0.1,0.1,0.1,0.2,0.2c0.1,0.1,0.1,0.1,0.2,0.1
                c0.1,0,0.1,0.1,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1c0.1,0.1,0.2,0.1,0.3,0.2c0.1,0,0.1,0.1,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1
                c0.1,0.1,0.2,0.1,0.3,0.2c0.1,0,0.2,0.1,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1
                c0.1,0,0.1,0.1,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1c0.1,0.1,0.3,0.1,0.4,0.2c0.2,0.1,0.5,0.2,0.7,0.3
                c0.1,0,0.1,0,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1c0.1,0,0.2,0.1,0.3,0.1c0.1,0,0.1,0,0.2,0.1c0.1,0,0.2,0,0.2,0.1c0,0,0,0,0,0
                c0.1,0,0.2,0,0.2,0.1c0.1,0,0.2,0,0.2,0.1C211.6,117.8,211.7,117.8,211.7,117.8z"/>
          <path fill="#897E50" d="M214.4,161.6l-1,1.4h0h0h0l-25,25.8l-2.5,2.5l0,0l-0.7,0.7h0l-2.5,2.6l0.2,0l-7.7,8.2v0l-3.4,3.4l-0.1,0
                l-30.1,31.4c-1.6,1.7-4.3,1.7-5.9,0.1l-2.4-2.4L123,225.3c-1.6-1.6-1.6-4.1-0.1-5.7c0,0,0,0,0.1-0.1c0,0,0.1-0.1,0.1-0.1l36.3-34.7
                l3.4-3.3l1.1-1.1l0,0l3.4-3.3l31.1-29.7l1.1-1.1c1.6-1.5,4.1-1.5,5.7,0l0,0l7,7l0,0l2.1,2.3C215.9,157.3,215.9,160,214.4,161.6z"/>
          <path fill="#999999" d="M217.7,166.8l-23.3-23.3c-1.1-1.1-1.4-2.8-0.7-4.1l11.8-24c1.1-2.2,4-2.7,5.8-1l35.5,35.5
                c1.8,1.8,1.3,4.7-1,5.8l-24,11.8C220.5,168.1,218.8,167.9,217.7,166.8z"/>
          <path fill="#B2B2B2" d="M248,189.9C247.9,189.9,247.9,189.9,248,189.9c-0.8,0.8-2-0.1-1.6-1c4.3-10.4,1.6-23.6-7.6-33.3
                c-0.4-0.4-0.4-1,0-1.4l5.5-5.5c0.4-0.4,1-0.4,1.4,0C257.4,161.1,258.5,179.3,248,189.9z"/>
          <path fill="#CCCCCC" d="M182.8,114.1L182.8,114.1c-2.4-2.4-2.4-6.3,0-8.7l4.8-4.8c2.4-2.4,6.3-2.4,8.7,0v0c2.4,2.4,2.4,6.3,0,8.7
                l-4.8,4.8C189.1,116.5,185.2,116.5,182.8,114.1z"/>
          <path fill="#FFFFFF" d="M211.7,117.8L211.7,117.8c-2.7-0.7-5.5-2.2-8-4.3C206.2,115.6,209,117,211.7,117.8z"/>
          <path fill="#CCCCCC" d="M182.3,113.7L182.3,113.7c-2.2-2.2-2.2-5.7,0-7.9l5.7-5.7c2.2-2.2,5.7-2.2,7.9,0v0c2.2,2.2,2.2,5.7,0,7.9
                l-5.7,5.7C188,115.8,184.5,115.8,182.3,113.7z"/>
          <path fill="#AA9D68" d="M211.8,158.8l-1.1,1.2h0l-25.1,25.9l-2.5,2.6l-0.7,0.7l-2.5,2.6l-7.9,8.2l-3.3,3.4l-30.2,31.3
                c-1.6,1.7-4.1,1.9-5.4,0.5L123,225.3l-0.4-0.4c-1.3-1.3-1.2-3.7,0.4-5.3c0,0,0,0,0.1-0.1c0,0,0.1-0.1,0.1-0.1l36.2-34.8l3.4-3.3
                l1.1-1.1l3.4-3.3l30.9-29.8l1.1-1.1c1.6-1.6,4-1.7,5.3-0.4l0.7,0.7l7,7l0,0.1C213.5,154.8,213.4,157.2,211.8,158.8z"/>
          <path fill="#CCCCCC" d="M216.2,165.2L194,143c-1-1-1.3-2.7-0.6-4l12.1-23.7c1.1-2.2,4-2.7,5.7-1.1L245,148c1.7,1.7,1.1,4.6-1.1,5.7
                l-23.7,12.1C218.8,166.5,217.2,166.3,216.2,165.2z"/>
          <g>
                <path fill="#666666" d="M213.1,232.2c-0.3,0.1-0.5,0.2-0.8,0.3c-3.2,0.9-7.1,0.2-10.1-2.3c-0.3-0.2-0.6-0.5-0.9-0.7
                      c0,0,0,0-0.1-0.1c-0.1-0.1-0.1-0.1-0.2-0.2l-26.4-26.3l-2.7-2.7l0,0c-0.1-0.1-0.2-0.2-0.2-0.2c-0.1-0.1-0.1-0.1-0.2-0.2
                      c-1.7-1.9-2.8-4.1-3.1-6.3c-0.3-1.9-0.1-3.9,0.6-5.6c0-0.1,0.1-0.1,0.1-0.2c0.2-0.4,0.4-0.8,0.7-1.2c0,0,0,0,0,0
                      c0.1-0.1,0.1-0.2,0.2-0.3l0,0c0.1-0.1,0.1-0.1,0.2-0.2c0.2-0.3,0.4-0.5,0.7-0.8c0.8-0.8,1.6-1.4,2.6-1.8c3.8-1.7,8.7-0.8,12.2,2.6
                      c0.1,0.1,0.2,0.2,0.3,0.2l2.4,2.4l-2.5,2.6l0,0l0,0l-0.7,0.8l26.1,26.1c0.4,0.4,0.7,0.8,1,1.1
                      C215.4,223.3,215.8,228.6,213.1,232.2z"/>
                <path fill="#666666" d="M213.1,232.2c1.2-1.6,1.8-3.5,1.8-5.4c0-0.1,0-0.3,0-0.4c-0.1-2.4-0.9-5-2.6-7.1c-0.3-0.3-0.6-0.7-0.9-1
                      c0,0-0.1-0.1-0.1-0.1l-26.1-26.1l0.7-0.8l0,0l0,0l-2.5-2.5c-0.1-0.1-0.1-0.1-0.2-0.2c-2.6-2.5-5.6-3.8-8.4-3.9
                      c-1.7-0.1-3.3,0.3-4.5,1.3c-0.1,0.1-0.2,0.2-0.4,0.3l0,0c0,0-0.1,0.1-0.1,0.1c0,0,0,0,0,0c0,0-0.1,0.1-0.1,0.1
                      c-0.3,0.3-0.6,0.7-0.9,1.1c0,0.1-0.1,0.2-0.1,0.2c-0.9,1.6-1,3.5-0.6,5.5c0.5,2.2,1.7,4.5,3.5,6.5c0.1,0.1,0.1,0.1,0.2,0.2
                      c0.1,0.1,0.2,0.2,0.3,0.2l0.1,0v0l2.7,2.7l0,0l26.3,26.3c0.1,0.1,0.1,0.1,0.2,0.2c0,0,0,0.1,0.1,0.1c0.3,0.3,0.6,0.5,0.8,0.8
                      c3.1,2.6,6.9,3.6,9.8,2.8c0,0,0-0.1,0-0.1h0c0.2,0,0.3,0,0.5,0h0L213.1,232.2z"/>
                <polygon fill="#666666" points="128.3,144.8 127.2,145.9 126.7,145.6 117.2,139.1 113,136.2 103.3,122.1 104.6,120.9 118.2,130.2
                      121.8,135.4 127.9,144.4             "/>
                <path fill="#666666" d="M176.1,188.9c-0.1,0.3-0.3,0.6-0.6,0.8c-0.8,0.8-1.9,1.1-2.9,0.9c-0.6-0.1-1.1-0.4-1.6-0.9
                      c0,0-0.1-0.1-0.1-0.1l0,0l-2.7-2.7l-5.5-5.5l-0.1-0.1l-35.5-35.5l-0.4-0.4l-7.5-7.5l1.1-1.1l1.4-1.4l6.1,8.9l0.4,0.4l35.5,35.5
                      l3.4-3.3l8.2,8.2l0,0c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.2,0.2,0.2,0.2C176.5,186.5,176.6,187.9,176.1,188.9z"/>
          </g>
          <path fill="#844141" d="M213.1,232.2c-0.2,0.3-0.4,0.8-0.7,0.8h0c-0.1,0-0.1,0.1-0.2,0.2c-0.2,0.2-0.5,0.5-0.7,0.7
                c-3.6,2.8-9.1,2.5-13.1-0.7c-0.3-0.2-0.6-0.5-0.9-0.7c0,0,0,0-0.1-0.1c-0.1-0.1-0.1-0.1-0.2-0.2l-25.8-25.8l-2.7-2.7l-0.5-0.5
                c-0.1-0.1-0.2-0.2-0.2-0.2c-3.3-3.5-4.3-8.4-2.6-12.1c0.3-0.7,0.7-1.4,1.2-2c0.2-0.3,0.4-0.5,0.7-0.8c0.4-0.4,0.8-0.7,1.2-1
                c0.5-0.3,0.9-0.6,1.4-0.8c0.1,0,0.1,0,0.2-0.1l0,0c0.1,0,0.1-0.1,0.2-0.1l0,0c1.7-0.7,3.7-0.9,5.6-0.5c2.3,0.4,4.6,1.6,6.4,3.5
                l0.3,0.3l2.7,2.7l26.1,26.1c0.4,0.4,0.7,0.8,1,1.2C215.4,223.3,215.8,228.6,213.1,232.2z"/>
          <path fill="#BC6F6F" d="M179.6,191.6l29.1,29.1c0.4,0.4,0.7,0.8,1,1.1c3.6,4.3,4.2,9.7,1.3,12.6c-2.9,2.9-8.3,2.2-12.6-1.3
                c-0.4-0.3-0.8-0.7-1.1-1L168.1,203c-4.4-4.4-5.5-10.6-2.3-13.7C169,186.1,175.1,187.1,179.6,191.6z"/>
          <polygon fill="#B3B3B3" points="127.9,144.4 126.7,145.5 126.7,145.6 123.4,148.8 109.2,139.1 99.6,125 104,120.5 104.6,120.9
                118.2,130.2 121.8,135.4       "/>
          <path fill="#B3B3B3" d="M172.6,190.6c0,0.7-0.3,1.5-0.9,2c-0.9,0.9-2.2,1.1-3.3,0.7c-0.1,0-0.3-0.1-0.4-0.2
                c-0.3-0.1-0.5-0.3-0.8-0.6c0,0-0.1-0.1-0.1-0.1l0,0l-7.9-7.9l-35.8-35.8l-7.9-7.9l1.8-1.8l2.7-2.7l0.4,0.4l7.5,7.5l0.4,0.4
                l35.5,35.5l0.1,0.1l0,0l5.8,5.7l0.1,0l0.2,0.1v0l1,1.1l0,0l0.6,0.7l0,0c0,0,0.1,0.1,0.1,0.1C172.4,188.8,172.7,189.7,172.6,190.6z"
                />
        </g>
      </svg>
    );
  }
}

ManualPlaceholder.defaultProps = {
  style: {
    color: 'white'
  }
};

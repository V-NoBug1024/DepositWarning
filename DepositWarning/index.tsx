import * as React from 'react';
import * as qs from 'query-string';
import TipText from '@components/TipText';
import Table from '@components/Table';
import './styles.scss';
import { getStoreDepositWarnData } from 'services/depositWarning';

const { memo, forwardRef, useState, useCallback, useEffect } = React;
const tipText =
    '说明：《微喔便利店特许经营合同》补充协议10.2.1约定：乙方营业款由甲方统一收银，乙方每日15点前必须将前一日的营业款存入甲方指定账户，并保证营业款金额与收银系统数据金额的，乙方必须在次日补上其差额，逾期付款须按未付部分支付每日5‰';
const DepositWarning = memo(
    forwardRef((props, ref) => {
        const [thList, setThList] = useState([]);
        const [tdList, setTdList] = useState([]);
        const [totalList, setTotalList] = useState(null);
        const [reportDate, setReportDate] = useState('');
        const [isMore, setIsMore] = useState(false)

        useEffect(() => {
            const params = qs.parse(window.location.search);
            const { msgid } = params;
            getStoreDepositWarnData(msgid).then((data: any) => {
                const {dataList, headerList, reportDate, storeDepositSum, pageTitle, title} = data
                window.document.title = pageTitle || title
                setThList(headerList);
                setTdList(dataList);
                setReportDate(reportDate);
                setTotalList(storeDepositSum && storeDepositSum[0]);
            });
        }, []);

        useEffect(() => {
            const $tableBox:any = document.querySelector('.table-box')
            const $tableBoxHeight = $tableBox.offsetHeight
            let h = 0;
            document.querySelectorAll('.table-box .list').forEach((i:any) => {
                h += i.offsetHeight
            })
            if($tableBoxHeight < h){
                setIsMore(true)
            }
        }, [tdList])

        return (
            <div className="desposit-root">
                <h3>{`推送日期：${reportDate}`}</h3>
                <Table
                    stickyLeftNum={2}
                    thList={thList}
                    tdList={tdList}
                    height="70vh"
                    totalList={totalList}
                    thTitleKey="name"
                />
                {isMore && <TipText className="tip-text" text="可下滑查看完整数据。" size="12px" />}
                <TipText className="tip-text" text={tipText} size="12px" />
            </div>
        );
    })
);

export default DepositWarning;
